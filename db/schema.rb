# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140529112011) do

  create_table "blocks", force: true do |t|
    t.string   "name"
    t.string   "left"
    t.string   "top"
    t.string   "width"
    t.string   "height"
    t.integer  "space_id"
    t.integer  "parent_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "block_type",   default: 0
    t.boolean  "is_floor",     default: false
    t.integer  "max_head_cap"
    t.integer  "footage"
    t.string   "equipment"
    t.integer  "fee"
    t.string   "image"
    t.datetime "start_at"
    t.datetime "end_at"
    t.string   "intro"
    t.boolean  "is_available"
    t.string   "color",        default: "#efefef"
  end

  create_table "categories", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "orders", force: true do |t|
    t.integer  "space_id"
    t.integer  "block_id"
    t.integer  "user_id"
    t.integer  "registration_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "is_activated",    default: false
  end

  create_table "registrations", force: true do |t|
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "is_pass",    default: false
    t.integer  "space_id"
    t.integer  "block_id"
  end

  create_table "searches", force: true do |t|
    t.string   "keywords"
    t.datetime "start_at"
    t.datetime "end_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "spaces", force: true do |t|
    t.string   "name"
    t.string   "address"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "is_public",   default: false
    t.string   "intro"
    t.integer  "category_id"
    t.string   "space_view"
    t.string   "contact"
    t.string   "phone"
    t.string   "surface"
    t.string   "height",      default: "72vh"
  end

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "password_digest"
    t.string   "remember_token"
    t.string   "nickname"
    t.string   "intro"
    t.string   "website"
    t.string   "avatar"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["remember_token"], name: "index_users_on_remember_token", using: :btree

end
