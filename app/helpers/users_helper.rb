module UsersHelper
  def gravatar_for(user, options = { size: 50, style: 'user_default' })
    gravatar_id = Digest::MD5::hexdigest(user.email.downcase)
    size = options[:size]
    style = options[:style]
    gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}?s=#{size}"
    image_tag(gravatar_url, alt: user.name, class: style)
  end
end
