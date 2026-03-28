#pragma once
#include "router.hpp"
#include <boost/asio.hpp>
#include <boost/asio/io_context.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <cstddef>

namespace {
namespace asio = boost::asio;
namespace ip = boost::asio::ip;
} // namespace

class Server {

  size_t port_;
  size_t backlog_;
  asio::io_context &context_;
  ip::tcp::acceptor acceptor_;
  Router router_;

  void accept_connection();

public:
  Server(asio::io_context &context, size_t &port, size_t &backlog,
         Router &router);

  void start();
};
