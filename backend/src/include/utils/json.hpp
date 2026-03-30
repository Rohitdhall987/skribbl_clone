#pragma once
#include <boost/json.hpp>
#include <boost/json/basic_parser.hpp>
#include <boost/system/detail/error_code.hpp>

namespace {
namespace json = boost::json;
}

namespace json_util {

struct handler {
  static constexpr std::size_t max_array_size = -1;

  static constexpr std::size_t max_object_size = -1;

  static constexpr std::size_t max_string_size = -1;

  static constexpr std::size_t max_key_size = -1;

  bool on_document_begin(boost::system::error_code &ec);

  bool on_document_end(boost::system::error_code &ec);

  bool on_array_begin(boost::system::error_code &ec);

  bool on_array_end(std::size_t n, boost::system::error_code &ec);

  bool on_object_begin(boost::system::error_code &ec);

  bool on_object_end(std::size_t n, boost::system::error_code &ec);

  bool on_string_part(std::string_view s, std::size_t n,
                      boost::system::error_code &ec);

  bool on_string(std::string_view s, std::size_t n,
                 boost::system::error_code &ec);

  bool on_key_part(std::string_view s, std::size_t n,
                   boost::system::error_code &ec);

  bool on_key(std::string_view s, std::size_t n, boost::system::error_code &ec);

  bool on_number_part(std::string_view s, boost::system::error_code &ec);

  bool on_int64(int64_t i, std::string_view s, boost::system::error_code &ec);

  bool on_uint64(uint64_t u, std::string_view s, boost::system::error_code &ec);

  bool on_double(double d, std::string_view s, boost::system::error_code &ec);

  bool on_bool(bool b, boost::system::error_code &ec);

  bool on_null(boost::system::error_code &ec);

  bool on_comment_part(std::string_view s, boost::system::error_code &ec);

  bool on_comment(std::string_view s, boost::system::error_code &ec);
};

class null_parser {
  struct handler {
    constexpr static std::size_t max_object_size = std::size_t(-1);
    constexpr static std::size_t max_array_size = std::size_t(-1);
    constexpr static std::size_t max_key_size = std::size_t(-1);
    constexpr static std::size_t max_string_size = std::size_t(-1);

    bool on_document_begin(boost::system::error_code &) { return true; }
    bool on_document_end(boost::system::error_code &) { return true; }
    bool on_object_begin(boost::system::error_code &) { return true; }
    bool on_object_end(std::size_t, boost::system::error_code &) {
      return true;
    }
    bool on_array_begin(boost::system::error_code &) { return true; }
    bool on_array_end(std::size_t, boost::system::error_code &) { return true; }
    bool on_key_part(std::string_view, std::size_t,
                     boost::system::error_code &) {
      return true;
    }
    bool on_key(std::string_view, std::size_t, boost::system::error_code &) {
      return true;
    }
    bool on_string_part(std::string_view, std::size_t,
                        boost::system::error_code &) {
      return true;
    }
    bool on_string(std::string_view, std::size_t, boost::system::error_code &) {
      return true;
    }
    bool on_number_part(std::string_view, boost::system::error_code &) {
      return true;
    }
    bool on_int64(std::int64_t, std::string_view, boost::system::error_code &) {
      return true;
    }
    bool on_uint64(std::uint64_t, std::string_view,
                   boost::system::error_code &) {
      return true;
    }
    bool on_double(double, std::string_view, boost::system::error_code &) {
      return true;
    }
    bool on_bool(bool, boost::system::error_code &) { return true; }
    bool on_null(boost::system::error_code &) { return true; }
    bool on_comment_part(std::string_view, boost::system::error_code &) {
      return true;
    }
    bool on_comment(std::string_view, boost::system::error_code &) {
      return true;
    }
  };

  json::basic_parser<handler> p_;

public:
  null_parser() : p_(json::parse_options()) {}

  ~null_parser() {}

  std::size_t write(char const *data, std::size_t size,
                    boost::system::error_code &ec) {
    auto const n = p_.write_some(false, data, size, ec);
    if (!ec && n < size)
      ec = json::error::extra_data;
    return n;
  }
};

bool is_valid(std::string_view s);

} // namespace json_util
