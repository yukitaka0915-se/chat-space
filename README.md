# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

## usersテーブル
|Column|Type|Options|
|------|----|-------|
|id|integer|primary_key: true|
|name|string|null: false|
|email|string|null: false, unique: true|
|password|string|null: false|

### Association
- has_many :group, through: :group_user 


## groupsテーブル
|Column|Type|Options|
|------|----|-------|
|id|integer|primary_key: true|
|name|string|null: false|
|user_id|integer|null: false, foreign_key: true|

### Association
- belongs_to :user
- has_many :group_user, through: :message


## group_usersテーブル
|Column|Type|Options|
|------|----|-------|
|id|integer|primary_key: true|
|group_id|integer|null: false, foreign_key: true|
|user_id|integer|null: false, foreign_key: true|

### Association
- belongs_to :group
- has_many :message


## messagesテーブル
|Column|Type|Options|
|------|----|-------|
|id|integer|primary_key: true|
|body|string|null: false|
|image|string||
|group_id|integer|null: false, foreign_key: true|
|user_id|integer|null: false, foreign_key: true|

### Association
- belongs_to :group_user
