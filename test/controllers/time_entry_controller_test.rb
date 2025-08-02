require "test_helper"

class TimeEntryControllerTest < ActionDispatch::IntegrationTest
  test "should get name:string" do
    get time_entry_name:string_url
    assert_response :success
  end

  test "should get started_at:timestamp" do
    get time_entry_started_at:timestamp_url
    assert_response :success
  end

  test "should get finished_at:timestamp" do
    get time_entry_finished_at:timestamp_url
    assert_response :success
  end

  test "should get duration:timestamp" do
    get time_entry_duration:timestamp_url
    assert_response :success
  end
end
