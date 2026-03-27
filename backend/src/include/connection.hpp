#pragma once
#include <boost/asio.hpp>
#include <boost/asio/io_context.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <string>
#include <system_error>

namespace {
namespace asio = boost::asio;
namespace ip = boost::asio::ip;
} // namespace

class Connection : public std::enable_shared_from_this<Connection> {
public:
  Connection(asio::io_context &context);
  ~Connection();

  void handle_connection(const std::error_code &ec);

  ip::tcp::socket socket;
  std::string readBuff;
};
