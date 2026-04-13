#pragma once

#include <boost/asio.hpp>
#include <boost/beast.hpp>
#include <memory>
#include <queue>
#include <string>

class Room;

namespace beast = boost::beast;
namespace websocket = beast::websocket;
namespace net = boost::asio;
using tcp = net::ip::tcp;

class Session : public std::enable_shared_from_this<Session> {
public:
  Session(tcp::socket socket, std::shared_ptr<Room> r);

  void start(beast::http::request<beast::http::string_body> req);
  void read();
  void send(const std::string &msg);

  std::string get_player_id() const;

private:
  void broadcast(const std::string &msg);
  void do_write();

  websocket::stream<tcp::socket> ws;
  beast::flat_buffer buffer;
  std::shared_ptr<Room> room;

  std::string player_id;

  std::queue<std::string> write_queue;
  bool writing = false;
};
