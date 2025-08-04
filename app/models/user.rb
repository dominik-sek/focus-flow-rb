class User < ApplicationRecord
  before_save :downcase_email

  has_secure_password

  validates :email, presence: true
  validates_format_of :email, with: URI::MailTo::EMAIL_REGEXP

  private
  def downcase_email
    self.email = email.downcase
  end
end
