defmodule ApiPostsV2.Crawler do
  use Tesla
  require Logger

  # create

  defp tesla_client(),
    do:
      Tesla.client([
        Tesla.Middleware.FormUrlencoded
      ])

  def scrap(url) do
    unless url do
      Logger.info("URL is required")
    end

    request_post_data(url)
  end

  defp request_post_data(url) do
    Logger.info("Extracting infos from: #{url}\n")

    {:ok, response} =
      Tesla.get(
        tesla_client(),
        "https://medium.com/@arifgilany/new-habits-f83afe376644?format=json"
      )

    response = response.body |> safe_replace_tag()
    response = Jason.decode!(response)

    paragraphs =
      response
      |> Map.get("payload")
      |> Map.get("value")
      |> Map.get("content")
      |> Map.get("bodyModel")
      |> Map.get("paragraphs")

    correct_paragraphs = Enum.map(paragraphs, fn x -> replace_paragraphs(x) end)

    IO.inspect(correct_paragraphs)

    correct_paragraphs
  end

  defp replace_tag(tag) do
    case tag do
      "&" -> "&amp;"
      "<" -> "&lt;"
      ">" -> "&gt;"
      default -> tag
    end
  end

  defp correct_tag(tag) do
    case tag do
      0 -> "<p>_$_</p>"
      1 -> "<p>_$_</p>"
      3 -> "<h1>_$_</h1>"
      4 -> "<img width='100%' src='https://miro.medium.com/max/1400/_$_' />"
      6 -> "<blockquote>_$_</blockquote>"
      7 -> "<blockquote>_$_</blockquote>"
      8 -> "<pre>_$_</pre>"
      9 -> "<li><a href='_$_'>_%_</a></li>"
      10 -> "<ol>_$_</ol>"
      11 -> "<iframe width='100%' src='_$_'></iframe>"
      13 -> "<h2>_$_</h2>"
      14 -> "<a href='_$_'>_%_</a>"
    end
  end

  defp safe_replace_tag(content) do
    String.replace(content, "])}while(1);</x>", "")
  end

  defp replace_paragraphs(paragraph) do
    iframe = ""

    gist = ""

    if paragraph
       |> Map.get("iframe") do
      iframe = iframe_extract(paragraph |> Map.get("iframe"))
      gist = gist_extract(iframe)
    end

    result = %{
      text: paragraph |> Map.get("text", ""),
      tag: correct_tag(paragraph |> Map.get("type", "")),
      mixtapeMetadata: paragraph |> Map.get("mixtapeMetadata", ""),
      iframe: iframe,
      gist: gist,
      markups:
        if Enum.count(paragraph |> Map.get("markups", [])) > 0 do
          paragraph |> Map.get("markups")
        else
          []
        end,
      metadata: paragraph |> Map.get("metadata", "")
    }

    result
  end

  defp iframe_extract(iframe) do
    resource_id = iframe |> Map.get("mediaResourceId")

    {:ok, response} =
      Tesla.get(
        tesla_client(),
        "https://medium.com/media/#{resource_id}"
      )

    response = response.body |> safe_replace_tag()
    response = Jason.decode!(response)

    iframe_payload = response |> Map.get("payload") |> Map.get("value")
    IO.inspect(iframe_payload)
    iframe_payload
  end

  defp gist_extract(iframe) do
    domain = iframe |> Map.get("domain")
    gist_id = domain |> Map.get("gistId")

    {:ok, response} =
      Tesla.get(
        tesla_client(),
        "https://#{domain}/#{gist_id}.json"
      )

    response = Jason.decode!(response)
    response
  end
end
