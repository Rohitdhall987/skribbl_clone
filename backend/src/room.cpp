#include "include/room.hpp"
#include "include/session.hpp"

Room::Room(size_t player_count, size_t hints, size_t rounds, size_t duration,
           player creator, std::string link, std::string pass)
    : player_count_(player_count), hints_(hints), rounds_(rounds),
      duration_(duration), creator_(creator), room_link(link), password(pass) {
  add_player(creator_);
}

void Room::add_player(player p) { players.push_back(p); }

void Room::add_session(std::shared_ptr<Session> s) { sessions.push_back(s); }

bool Room::verify(std::string link, std::string pass) {
  return link == room_link && pass == password;
}

void Room::remove_session(std::shared_ptr<Session> s) {
  sessions.erase(std::remove(sessions.begin(), sessions.end(), s),
                 sessions.end());
}
