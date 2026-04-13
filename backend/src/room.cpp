
#include "include/room.hpp"
#include "include/session.hpp"
#include "include/utils/words.cpp"

#include <algorithm>
#include <boost/json.hpp>
#include <random>
#include <thread>

Room::Room(size_t player_count, size_t hints, size_t rounds, size_t duration,
           player creator, std::string link, std::string pass)
    : player_count_(player_count), hints_(hints), rounds_(rounds),
      duration_(duration), creator_(creator), room_link(link), password(pass) {
  add_player(creator_);
}

void Room::add_player(player p) {
  std::lock_guard<std::mutex> lock(mtx);
  players.push_back(p);
}

void Room::add_session(std::shared_ptr<Session> s) {
  std::lock_guard<std::mutex> lock(mtx);
  sessions.push_back(s);
}

void Room::remove_session(std::shared_ptr<Session> s) {
  std::lock_guard<std::mutex> lock(mtx);
  sessions.erase(std::remove(sessions.begin(), sessions.end(), s),
                 sessions.end());
}

bool Room::verify(std::string link, std::string pass) {
  return link == room_link && pass == password;
}

std::string Room::get_state_json() {
  boost::json::object obj;

  obj["type"] = "init";
  obj["creator"] = creator_.id;
  obj["current_round"] = current_round_;
  obj["total_rounds"] = rounds_;
  obj["time"] = count_down_;
  obj["started"] = started_;

  boost::json::array players_arr;

  for (const auto &p : players) {
    boost::json::object p_obj;
    p_obj["id"] = p.id;
    p_obj["name"] = p.name;
    p_obj["score"] = p.score;
    players_arr.push_back(p_obj);
  }

  obj["players"] = players_arr;

  return boost::json::serialize(obj);
}

void Room::handle_start(std::shared_ptr<Session> sender) {
  std::lock_guard<std::mutex> lock(mtx);

  if (started_)
    return;

  started_ = true;

  std::thread([self = shared_from_this()]() { self->start_game(); }).detach();
}

void Room::start_game() {
  std::lock_guard<std::mutex> lock(mtx);

  if (players.empty())
    return;

  current_player_index_ = 0;
  auto &p = players[current_player_index_];

  boost::json::object turn_msg;
  turn_msg["type"] = "turn";
  turn_msg["player"] = p.id;

  std::string turn_str = boost::json::serialize(turn_msg);

  for (auto &s : sessions) {
    s->send(turn_str);
  }

  auto words = pick_random_words(3);

  boost::json::object word_msg;
  word_msg["type"] = "words";

  boost::json::array arr;
  for (auto &w : words)
    arr.emplace_back(w);

  word_msg["options"] = arr;

  std::string word_str = boost::json::serialize(word_msg);

  for (auto &s : sessions) {
    if (s->get_player_id() == p.id) {
      s->send(word_str);
      break;
    }
  }
}

std::vector<std::string> Room::pick_random_words(int count) {
  std::vector<std::string> result;
  std::vector<std::string> available;

  for (auto &w : words_pool) {
    if (std::find(used_words.begin(), used_words.end(), w) ==
        used_words.end()) {
      available.push_back(w);
    }
  }

  std::shuffle(available.begin(), available.end(),
               std::mt19937(std::random_device()()));

  for (int i = 0; i < count && i < available.size(); i++) {
    result.push_back(available[i]);
    used_words.push_back(available[i]);
  }

  return result;
}
