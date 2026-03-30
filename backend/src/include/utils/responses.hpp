#pragma once

#include <boost/asio/ip/tcp.hpp>
#include <string>

namespace {
namespace ip = boost::asio::ip;
}

class Response {
public:
  std::string version = "HTTP/1.1";
  std::string status = "200 Ok";
  std::string content_type = "text/plain";
  std::string content = "";

  void send(ip::tcp::socket &soc);
  void err(ip::tcp::socket &soc, std::string msg);
};
