json.array! @messages do |message|
  json.body message.body
  json.image message.image.url
  json.user_name message.user.name
  json.id message.id
  json.created_at message.created_at.strftime("%Y/%m/%d %H:%M")

end