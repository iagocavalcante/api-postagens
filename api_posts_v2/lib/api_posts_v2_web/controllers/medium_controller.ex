defmodule ApiPostsV2Web.MediumController do
  use ApiPostsV2Web, :controller

  action_fallback(ApiPostsV2Web.FallbackController)

  def index(conn, %{"url" => url} = _params) do
    # {:ok, raw} = ApiPostsV2.Crawler.scrap(url)
    raw = ApiPostsV2.Crawler.scrap(url)

    render(conn, "index.json", medium: raw)
  end

  def update(conn, %{"id" => id, "medium" => medium_params}) do
    medium = %{}

    render(conn, "show.json", medium: medium)
  end
end
