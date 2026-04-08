cmake_minimum_required(VERSION 3.16)
project(skribbl_server)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

cmake_policy(SET CMP0167 NEW)

find_package(Boost 1.89 REQUIRED COMPONENTS json)

add_executable(skribbl_server
main.cpp
server.cpp
connection.cpp
router.cpp
room.cpp
session.cpp
utils/json.cpp
utils/responses.cpp
utils/query.cpp
)

target_include_directories(skribbl_server PRIVATE ${Boost_INCLUDE_DIRS})
target_compile_definitions(skribbl_server PRIVATE BOOST_ASIO_NO_DEPRECATED)
target_link_libraries(skribbl_server PRIVATE pthread Boost::json)

