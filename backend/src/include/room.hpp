#pragma once

#include <boost/asio.hpp>
#include <boost/beast.hpp>
#include <cstddef>
#include <string>
#include <vector>

namespace {
namespace websocket = boost::beast::websocket;
namespace ip = boost::asio::ip;
} // namespace

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
  std::vector<std::shared_ptr<websocket::stream<ip::tcp::socket>>> sessions;
  Room(size_t player_count, size_t hints, size_t rounds, size_t duration,
       player creator, std::string link, std::string pass);

  void add_player(player p);

  void add_session(std::shared_ptr<websocket::stream<ip::tcp::socket>> ws);

  bool verify(std::string link, std::string pass);
};
