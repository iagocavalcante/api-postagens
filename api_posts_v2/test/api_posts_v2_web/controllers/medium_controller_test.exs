defmodule ApiPostsV2Web.MediumControllerTest do
  use ApiPostsV2Web.ConnCase

  import ApiPostsV2.PostsFixtures

  alias ApiPostsV2.Posts.Medium

  @create_attrs %{

  }
  @update_attrs %{

  }
  @invalid_attrs %{}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all medium", %{conn: conn} do
      conn = get(conn, Routes.medium_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create medium" do
    test "renders medium when data is valid", %{conn: conn} do
      conn = post(conn, Routes.medium_path(conn, :create), medium: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.medium_path(conn, :show, id))

      assert %{
               "id" => ^id
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.medium_path(conn, :create), medium: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update medium" do
    setup [:create_medium]

    test "renders medium when data is valid", %{conn: conn, medium: %Medium{id: id} = medium} do
      conn = put(conn, Routes.medium_path(conn, :update, medium), medium: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.medium_path(conn, :show, id))

      assert %{
               "id" => ^id
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, medium: medium} do
      conn = put(conn, Routes.medium_path(conn, :update, medium), medium: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete medium" do
    setup [:create_medium]

    test "deletes chosen medium", %{conn: conn, medium: medium} do
      conn = delete(conn, Routes.medium_path(conn, :delete, medium))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.medium_path(conn, :show, medium))
      end
    end
  end

  defp create_medium(_) do
    medium = medium_fixture()
    %{medium: medium}
  end
end
