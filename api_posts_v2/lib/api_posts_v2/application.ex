defmodule ApiPostsV2.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      ApiPostsV2.Repo,
      # Start the Telemetry supervisor
      ApiPostsV2Web.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: ApiPostsV2.PubSub},
      # Start the Endpoint (http/https)
      ApiPostsV2Web.Endpoint
      # Start a worker by calling: ApiPostsV2.Worker.start_link(arg)
      # {ApiPostsV2.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: ApiPostsV2.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    ApiPostsV2Web.Endpoint.config_change(changed, removed)
    :ok
  end
end
