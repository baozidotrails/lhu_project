json.array!(@blocks) do |block|
  json.extract! block, :id, :name, :left, :top, :width, :height, :space_id, :is_leaf
  json.url block_url(block, format: :json)
end
