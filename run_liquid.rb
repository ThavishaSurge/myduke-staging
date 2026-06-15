require 'liquid'
template = Liquid::Template.parse("{{ '' | split: '' | push: 'a' | join: ',' }}")
puts template.render
