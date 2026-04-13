#include "include/session.hpp"
#include "include/room.hpp"

#include <boost/json.hpp>
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

    self->send(self->room->get_state_json());

    self->read();
  });
}

void Session::read() {
  ws.async_read(
      buffer, [self = shared_from_this()](beast::error_code ec, std::size_t) {
        if (ec) {
          self->room->remove_session(self);
          return;
        }

        std::string msg = beast::buffers_to_string(self->buffer.data());
        self->buffer.consume(self->buffer.size());

        auto body = boost::json::parse(msg).as_object();
        std::string type = body["type"].as_string().c_str();

        if (type == "player") {
          auto data = body["data"].as_object();

          self->player_id = data["id"].as_string().c_str();

          player p;
          p.id = data["id"].as_string().c_str();
          p.name = data["name"].as_string().c_str();
          p.score = data["score"].as_int64();

          self->room->add_player(p);
        }

        else if (type == "start") {
          self->room->handle_start(self);
        }

        else {
          self->broadcast(msg);
        }

        self->read();
      });
}

void Session::send(const std::string &msg) {
  write_queue.push(msg);

  if (writing)
    return;

  writing = true;
  do_write();
}

void Session::do_write() {
  ws.text(true);

  ws.async_write(
      net::buffer(write_queue.front()),
      [self = shared_from_this()](beast::error_code ec, std::size_t) {
        if (ec) {
          std::cerr << "❌ Write failed: " << ec.message() << "\n";
          return;
        }

        self->write_queue.pop();

        if (!self->write_queue.empty()) {
          self->do_write();
        } else {
          self->writing = false;
        }
      });
}

void Session::broadcast(const std::string &msg) {
  for (auto &s : room->sessions) {
    s->send(msg);
  }
}

std::string Session::get_player_id() const { return player_id; }
