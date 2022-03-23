defmodule ApiPostsV2.Repo do
  use Ecto.Repo,
    otp_app: :api_posts_v2,
    adapter: Ecto.Adapters.Postgres
end
