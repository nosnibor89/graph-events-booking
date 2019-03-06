# mutation {
#   cancelBooking(bookingId: "5c66dadb3dfdec2491c1a66a") {
#     _id,
#     title,
#     createdBy{
#       email
#     }
#   }
# }

# query {
#   bookings{
#     _id,
#     createdAt,
#     updatedAt,
#     user{
#       email
#     },
#     event{
#       title,
#       createdBy{
#         email
#       }
#     }
#   }
# }

# mutation {
#   bookEvent(eventId: "5c62b58e7b59fc2d8f826c11"){
#     _id,
#     createdAt,
#     updatedAt,
#     user{
#       email
#     },
#     event{
#       title,
#       date,
#       price
#     }
#   }
# }

# mutation {
#   createEvent(eventInput: { 
#     title: "Some4", 
#     description: "some des4", 
#     price:12.3,
#     date: "02/08/2019"
#   }) {
#     _id,
#     title
#     date,
#     createdBy{
#       email
#     }
#   }
# }

 # query {
 #   events{
 #     _id,
 #     title,
 #     date,
 #    createdBy{
 #      email,
 #      createdEvents{
 #        title,
 #        createdBy{
 #          email
 #        }
 #      }
 #    }
 #   }
 # }

# mutation {
#   createUser(userInput: { 
#     email: "myuseremaill2", 
#     password: "123", 
#   }) {
#     _id,
#     email,
#   }
# }

# query {
#   users{
#     _id,
#     createdEvents{
#       _id,
#       title,
#       createdBy{
#         email,
#         createdEvents{
#           _id,
#           title,
#           createdBy{
#             _id
#           }
#         }
#       }
#     }
#   }
# }

# {
#       login(email: "${email}", password: "${password}") {
#         token
#         tokenExpiration
#         userId
#       }
#     }