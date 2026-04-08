#pragma once

#include <boost/asio.hpp>
#include <boost/beast.hpp>
#include <cstddef>
#include <string>
#include <vector>

class Session;
typedef struct {
  size_t id;
  std::string name;
} player;

class Room {
  bool started = false;

  size_t player_count_;
  size_t hints_;
  size_t rounds_;
  size_t duration_;

  std::string room_link;
  std::string password;

  std::vector<player> players;

  player creator_;

public:
  std::vector<std::shared_ptr<Session>> sessions;

  Room(size_t player_count, size_t hints, size_t rounds, size_t duration,
       player creator, std::string link, std::string pass);

  void add_player(player p);

  void add_session(std::shared_ptr<Session> s);

  bool verify(std::string link, std::string pass);

  void remove_session(std::shared_ptr<Session> s);
};
