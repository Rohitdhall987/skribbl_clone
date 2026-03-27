#include "include/server.hpp"
#include "include/connection.hpp"
#include <boost/asio/buffer.hpp>
#include <boost/asio/io_context.hpp>
#include <boost/asio/ip/tcp.hpp>

#include <system_error>

Server::Server(asio::io_context &context, size_t &port, size_t &backlog)
    : context_(context), port_(port), backlog_(backlog),
      acceptor_(context_, ip::tcp::endpoint(ip::tcp::v4(), port_)) {
  start_connection();
};

void Server::start() { context_.run(); }

void Server::start_connection() {

  auto con = std::make_shared<Connection>(context_);

  acceptor_.async_accept(con->socket, [this, con](const std::error_code &ec) {
    con->handle_connection(ec);

    start_connection();
  });
}
