defmodule ApiPostsV2Web.MediumView do
  use ApiPostsV2Web, :view
  alias ApiPostsV2Web.MediumView

  def render("index.json", %{medium: medium}) do
    %{data: render_one(medium, MediumView, "medium.json")}
  end

  def render("show.json", %{medium: medium}) do
    %{data: render_one(medium, MediumView, "medium.json")}
  end

  def render("medium.json", %{medium: medium}) do
    %{
      html: medium
    }
  end
end
