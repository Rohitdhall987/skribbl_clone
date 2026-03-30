#include "../include/utils/json.hpp"

bool json_util::is_valid(std::string_view s) {
  null_parser p;
  boost::system::error_code ec;
  p.write(s.data(), s.size(), ec);
  if (ec)
    return false;

  return true;
}
