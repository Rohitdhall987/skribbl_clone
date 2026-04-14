#pragma once

#include <boost/asio.hpp>
#include <boost/beast.hpp>
#include <memory>
#include <mutex>
#include <string>
#include <vector>

class Session;

typedef struct {
  std::string id;
  std::string name;
  size_t score;
} player;

class Room : public std::enable_shared_from_this<Room> {
  bool started_ = false;

  size_t current_player_index_ = 0;

  size_t player_count_;
  size_t hints_;
  size_t rounds_;
  size_t current_round_ = 0;
  size_t duration_;
  size_t count_down_ = 0;

  std::vector<std::string> used_words;

  std::string room_link;
  std::string password;

  std::vector<player> players;

  player creator_;

  std::mutex mtx;

public:
  std::vector<std::shared_ptr<Session>> sessions;

  Room(size_t player_count, size_t hints, size_t rounds, size_t duration,
       player creator, std::string link, std::string pass);

  void add_player(player p);
  void add_session(std::shared_ptr<Session> s);
  void remove_session(std::shared_ptr<Session> s);

  bool verify(std::string link, std::string pass);

  void handle_start(std::shared_ptr<Session> sender);
  void start_game();
  bool find_player(std::string id);

  std::vector<std::string> pick_random_words(int count);

  std::string get_state_json();
};
