#include "include/router.hpp"
#include "include/room.hpp"
#include "include/session.hpp"
#include "include/utils/json.hpp"
#include "include/utils/query.hpp"
#include "include/utils/responses.hpp"
#include <boost/asio/ip/tcp.hpp>
#include <boost/beast/http/message_fwd.hpp>
#include <boost/beast/http/string_body_fwd.hpp>
#include <boost/beast/http/verb.hpp>
#include <boost/json.hpp>
#include <boost/json/basic_parser.hpp>
#include <boost/json/object.hpp>
#include <boost/json/parse.hpp>
#include <boost/json/string.hpp>
#include <boost/json/value.hpp>
#include <boost/system/detail/error_code.hpp>
#include <iostream>
#include <memory>
#include <string>
#include <vector>

namespace {
namespace http = boost::beast::http;
namespace ip = boost::asio::ip;
namespace json = boost::json;

std::unordered_map<std::string, std::shared_ptr<Room>> rooms;
std::mutex room_mutex;

} // namespace

Router::Router() {
  add(Route{http::verb::options, "/",
            [](http::request<http::string_body> &req, ip::tcp::socket &socket) {
              Response r;
              r.status = "204 No Content";
              r.send(socket);
            }});
  add(Route{http::verb::get, "/",
            [](http::request<http::string_body> &req, ip::tcp::socket &socket) {
              Response r;
              r.content = "Hey user";
              r.send(socket);
            }});

  add(Route{http::verb::post, "/create_room",
            [](http::request<http::string_body> &req, ip::tcp::socket &socket) {
              Response r;

              if (!json_util::is_valid(req.body())) {
                r.err(socket, "invalid json");
                return;
              }

              auto jv = json::parse(req.body());
              auto &body = jv.as_object();

              player creator{std::string(body.at("id").as_string()),
                             std::string(body.at("name").as_string()), 0};

              size_t players =
                  std::stoi(body.at("players").as_string().c_str());
              size_t duration =
                  std::stoi(body.at("duration").as_string().c_str());

              size_t rounds = std::stoi(body.at("rounds").as_string().c_str());
              size_t hints = std::stoi(body.at("hints").as_string().c_str());

              std::string link = std::to_string(rand() % 100000);
              std::string password = "1234"; // TODO:: replace later

              auto room = std::make_shared<Room>(
                  players, hints, rounds, duration, creator, link, password);

              {
                std::lock_guard<std::mutex> lock(room_mutex);
                rooms[link] = room;
              }

              r.status = "201 Created";
              r.content_type = "application/json";
              r.content = "{\"room_link\":\"" + link + "\", \"password\":\"" +
                          password + "\"}";
              r.send(socket);
            }});

  add(Route{http::verb::get, "/join",
            [](http::request<http::string_body> &req, ip::tcp::socket &socket) {
              std::cout << "---- NEW REQUEST ----\n";
              std::cout << "Target: " << req.target() << "\n";

              auto params = parse_query(std::string(req.target()));

              std::string link = params["link"];
              std::string password = params["pass"];

              std::shared_ptr<Room> room;

              {
                std::lock_guard<std::mutex> lock(room_mutex);

                std::cout << "Checking room existence...\n";

                if (rooms.find(link) == rooms.end()) {
                  std::cout << "❌ Room not found\n";
                  Response().err(socket, "room not found");
                  return;
                }

                room = rooms[link];

                std::cout << "Verifying password...\n";

                if (!room->verify(link, password)) {
                  std::cout << "❌ Wrong password\n";
                  Response().err(socket, "wrong password");
                  return;
                }

                std::cout << "✅ Room validated\n";
              }

              std::cout << "Creating Session...\n";

              auto session = std::make_shared<Session>(std::move(socket), room);

              session->start(req);

              std::cout << "Session started (async)\n";
            }});
}

void Router::add(const Route &r) { routes.push_back(r); }

const std::vector<Route> &Router::getRoutes() const { return routes; }
