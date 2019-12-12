FactoryBot.define do
  factory :message do
    body    {Faker::Lorem.sentence}
    image   {File.open("#{Rails.root}/public/images/25397013006.jpg")}
    user
    group
  end
end