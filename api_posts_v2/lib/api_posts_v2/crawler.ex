defmodule ApiPostsV2.Crawler do
  use Tesla
  require Logger

  defp tesla_client(),
    do:
      Tesla.client([
        Tesla.Middleware.FormUrlencoded
      ])

  def scrap(url) do
    request_post_data(url)
  end

  defp request_post_data(url) do
    Logger.info("Extracting infos from: #{url}\n")

    case Tesla.get(
           tesla_client(),
           url
         ) do
      {:ok, response} ->
        response = response.body |> remove_trash_from_body()

        case Jason.decode(response) do
          {:ok, json} ->
            if json.is_a?(Array) then
              paragraphs = json["payload"]["value"]["content"]["bodyModel"]["paragraphs"]

              correct_paragraphs = Enum.map(paragraphs, &replace_paragraphs/1)

              Logger.info("Found #{json.size} posts")

              correct_paragraphs
            else
              Logger.info("Found 1 post")

              [json]
            end

          {:err, err} ->
            Logger.error("Error while decoding JSON: #{err}")
            nil
        end

      {:error, _} ->
        Logger.info("Extracting infos from: #{url}\n")
    end
  end

  defp replace_tag(tag) do
    case tag do
      "&" -> "&amp;"
      "<" -> "&lt;"
      ">" -> "&gt;"
      _ -> tag
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

  defp remove_trash_from_body(content) do
    String.replace(content, "])}while(1);</x>", "")
  end

  defp replace_paragraphs(paragraph) do
    iframe = ""

    gist = ""

    if paragraph["iframe"] do
      iframe = iframe_extract(paragraph["iframe"])
      gist = gist_extract(iframe)
    end

    if paragraph["type"] == 8 do
      Map.merge(paragraph["text"], replace_tag(paragraph["text"]))
    end

    result = %{
      text: paragraph["text"],
      tag: correct_tag(paragraph["type"]),
      mixtapeMetadata: paragraph["mixtapeMetadata"],
      iframe: iframe,
      gist: gist,
      markups:
        if Enum.any?(paragraph["markups"]) do
          paragraph["markups"]
        else
          []
        end,
      metadata: paragraph["metadata"]
    }

    result
  end

  defp iframe_extract(iframe) do
    resource_id = iframe["mediaResourceId"]

    case Tesla.get(
           tesla_client(),
           "https://medium.com/media/#{resource_id}"
         ) do
      {:ok, response} ->
        response = response.body |> remove_trash_from_body()
        case Jason.decode(response) do
          {:ok, json} ->
            iframe_payload = json["payload"]["value"]

            iframe_payload
          {:err, err} ->
            Logger.error("Error while decoding JSON: #{err}")
            nil
        end

      {:error, _} ->
        Logger.info("Error extracting iframe from: #{resource_id}\n")
    end
  end

  defp gist_extract(iframe) do
    domain = iframe["domain"]
    gist_id = domain["gistId"]

    case Tesla.get(
           tesla_client(),
           "https://#{domain}/#{gist_id}.json"
         ) do
      {:ok, response} ->
        case Jason.decode(response) do
          {:ok, json} ->
            response
          {:err, err} ->
            Logger.error("Error while decoding JSON: #{err}")
            nil
        end

      {:error, _} ->
        Logger.info("Error calling gist json")
    end
  end
end
