json.id @message.id
json.body @message.body
json.image @message.image
json.imagename File.basename(@message.image, ".*") if @message.image.nil?
json.user_id @message.user_id
json.group_id @message.group_id
json.name @message.user.name
json.created_at @message.created_at.strftime('%Y/%m/%d %H:%M:%S')
