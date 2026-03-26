#include "include/server.hpp"
#include <boost/asio/buffer.hpp>
#include <boost/asio/io_context.hpp>
#include <boost/asio/ip/tcp.hpp>

#include <boost/asio/read.hpp>
#include <boost/asio/read_until.hpp>
#include <cstddef>
#include <iostream>
#include <memory>
#include <ostream>
#include <system_error>
#include <utility>

Server::Server(asio::io_context &context, size_t &port, size_t &backlog)
    : context_(context), port_(port), backlog_(backlog),
      acceptor_(context_, ip::tcp::endpoint(ip::tcp::v4(), port_)) {
  start_connection();
};

void Server::start() { context_.run(); }

void Server::start_connection() {
  auto socket = std::make_shared<ip::tcp::socket>(context_);
  acceptor_.async_accept(*socket, [this, socket](const std::error_code &ec) {
    if (!ec) {
      handle_request(std::move(*socket));

    } else {
      std::cout << "Error while making connection (message):" << ec.value()
                << ":" << ec.message() << std::endl;
    }

    start_connection();
  });
}

void Server::handle_request(ip::tcp::socket &&soc) {

  auto socket = std::make_shared<ip::tcp::socket>(std::move(soc));
  auto buffer = std::make_shared<asio::streambuf>();

  asio::async_read_until(*socket, *buffer, "\r\n\r\n",
                         [this, socket, buffer](const std::error_code &ec,
                                                std::size_t bytes_transferred) {
                           std::cout
                               << "stuff readed from socket :" << buffer->size()
                               << std::endl;
                         });
}
