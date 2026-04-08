#pragma once

#include <boost/asio.hpp>
#include <boost/beast.hpp>
#include <memory>
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

private:
  void broadcast(const std::string &msg);

  websocket::stream<tcp::socket> ws;
  beast::flat_buffer buffer;
  std::shared_ptr<Room> room;
};
;
