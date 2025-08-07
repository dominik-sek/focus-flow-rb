# == Schema Information
#
# Table name: users
#
#  id              :bigint           not null, primary key
#  email           :string
#  last_login      :datetime
#  password_digest :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_users_on_email  (email) UNIQUE
#
class User < ApplicationRecord
  before_save :downcase_email

  has_secure_password
  has_many :projects, dependent: :destroy

  validates :email, presence: true
  validates_format_of :email, with: URI::MailTo::EMAIL_REGEXP

  private
  def downcase_email
    self.email = email.downcase
  end
end
