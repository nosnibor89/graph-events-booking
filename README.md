mutation {
  createEvent(eventInput: { 
    title: "Some4", 
    description: "some des4", 
    price:12.3,
    date: "02/08/2019"
  }) {
    _id,
    title
    date
  }
}

# query {
#   events{
#     _id,
#     title,
#     date
#   }
# }