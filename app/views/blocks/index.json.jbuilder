json.array!(@blocks) do |block|
  json.extract! block, :id, :name, :left, :top, :width, :height, :space_id, :block_type, :parent_id
  json.url block_url(block, format: :json)
end
