#include "include/session.hpp"
#include "include/room.hpp"
#include <iostream>

Session::Session(tcp::socket socket, std::shared_ptr<Room> r)
    : ws(std::move(socket)), room(r) {}

void Session::start(beast::http::request<beast::http::string_body> req) {
  ws.async_accept(req, [self = shared_from_this()](beast::error_code ec) {
    if (ec) {
      std::cerr << "❌ Accept failed: " << ec.message() << "\n";
      return;
    }

    std::cout << "✅ WebSocket connected!\n";

    self->room->add_session(self);
    self->read();
  });
}

void Session::read() {
  ws.async_read(
      buffer, [self = shared_from_this()](beast::error_code ec,
                                          std::size_t bytes_transferred) {
        boost::ignore_unused(bytes_transferred);

        if (ec) {
          if (ec != websocket::error::closed) {
            std::cerr << "❌ Disconnected: " << ec.message() << "\n";
          }
          self->room->remove_session(self);
          return;
        }

        std::string msg = beast::buffers_to_string(self->buffer.data());
        std::cout << "Received: " << msg << "\n";

        self->buffer.consume(self->buffer.size());

        self->broadcast(msg);

        self->read();
      });
}

void Session::send(const std::string &msg) {
  ws.text(true);
  ws.async_write(net::buffer(msg),
                 [self = shared_from_this()](beast::error_code ec,
                                             std::size_t bytes_transferred) {
                   boost::ignore_unused(bytes_transferred);
                   if (ec) {
                     std::cerr << "❌ Write failed: " << ec.message() << "\n";
                   }
                 });
}

void Session::broadcast(const std::string &msg) {
  for (auto const &session : room->sessions) {
    session->send(msg);
  }
}
