module Main exposing (main)

import Browser
import Calendar
import File exposing (File)
import File.Select as Select
import Html exposing (Html, br, button, div, h3, input, label, p, table, td, text, th, tr)
import Html exposing (Html, button)
import Html.Attributes exposing (placeholder, style, type_, value)
import Html.Events exposing (onClick, onInput)
import Json.Decode as Decode
import Json.Encode as Encode
import Maybe.Extra
import Task
import Time
import DateTime exposing (DateTime)
import DataDecoding exposing (SensorMeasurement)
import OutageDetection exposing (NodeOutage)
import Dict exposing (Dict)
import Dict.Extra
import Visualization
import Debug

main : Program () Model Msg
main =
  Browser.element
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }

-- MODEL


type Model = UploadForm Int
           | UploadError
           | Uploaded {
               numMeasurements: Int,
               minOutageLength: Int,
               outages: Dict String (List NodeOutage)
             }

init : () -> (Model, Cmd Msg)
init _ =
  ( initModel, Cmd.none )

initModel : Model
initModel = UploadForm 1


-- UPDATE


type Msg
  = ChangeMinOutageLength String
  | CsvRequested
  | CsvSelected File
  | CsvLoaded String



update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    ChangeMinOutageLength minLengthStr ->
      case minLengthStr |> String.toInt |> Maybe.Extra.filter (\x -> x > 0) of
        Just newMinLength ->
           (UploadForm newMinLength, Cmd.none)
        Nothing ->
           (model, Cmd.none)
    CsvRequested ->
      ( model, Select.file ["text/csv"] CsvSelected)        -- text/csv line should limit it to csv but this is not working? Not super urgent. 

    CsvSelected file ->
      ( model, Task.perform CsvLoaded (File.toString file))

    CsvLoaded content ->
      let
         minOutageLength = case model of
           UploadForm v -> v
           _ -> 0 -- not possible to have this
      in
      case DataDecoding.parseSensorMeasurements content of
        Just measurements ->
            let
                numMeasurements = List.length measurements
                outages = OutageDetection.detectAllOutages minOutageLength measurements
                groupedOutages = outages |> Dict.Extra.groupBy .affectedNodeId
                outagesPerNode = groupedOutages |> Dict.map (\_ nodeOutages -> List.length nodeOutages)
                sortedGroupedOutages = groupedOutages |> Dict.map (\_ os ->
                    os |> List.sortWith (\o1 o2 -> DateTime.compare o1.startTimestamp o2.startTimestamp)
                    )
            in
                (
                    Uploaded {
                        numMeasurements = numMeasurements,
                        minOutageLength = minOutageLength,
                        outages = sortedGroupedOutages
                    },
                    Visualization.elmToJS (Visualization.allSummaryVisualizations outages outagesPerNode)
                )
        Nothing ->
            (UploadError, Cmd.none)




-- VIEW


view : Model -> Html Msg
view model =
  case model of
    UploadForm minOutageLength ->
      div [ style "margin" "2em" ] [
            label [] [ text "Minimum outage length in minutes"],
            input [
              type_ "number",
              Html.Attributes.min "1",
              placeholder "Outage length in minutes",
              value <| String.fromInt minOutageLength,
              onInput ChangeMinOutageLength
              ] [],
            br [] [],
            button [ onClick CsvRequested ] [ text "Load CSV file" ]
      ]

    UploadError ->
      text "Upload error!"

    Uploaded { numMeasurements, minOutageLength, outages }  ->
      div [ style "margin" "2em" ] [
        p [] [ text <| "we have " ++ (String.fromInt numMeasurements) ++ " measurement(s)" ],
        p [] [ text <| "we display only outages of at least " ++ (String.fromInt minOutageLength) ++ " minute(s)" ],
        viewOutages outages
      ]

viewOutages : Dict String (List NodeOutage) -> Html Msg
viewOutages groupedOutages =
    div [] (
        groupedOutages
            |> Dict.toList
            |> List.map (\(nodeId, outages) -> viewNodeOutages nodeId outages)
    )

viewNodeOutages : String -> (List NodeOutage) -> Html Msg
viewNodeOutages nodeId outages =
        div [] [
            h3 [] [ text <| "affected node " ++ nodeId ],
            table [] (
                tr [] [
                   th [] [text "start timestamp"],
                   th [] [text "duration"]
                ] :: (
                outages |> List.map (\outage ->
                    tr [] [
                        td [] [text <| viewDateTime outage.startTimestamp],
                        td [] [text <| viewDuration outage.duration]
                    ]
                    )
                )
            )
        ]

viewDateTime : DateTime -> String
viewDateTime timestamp =
    let
        y = padNum <| DateTime.getYear timestamp
        mon = padNum <| Calendar.monthToInt <| DateTime.getMonth timestamp
        d = padNum <| DateTime.getDay timestamp
        h = padNum <| DateTime.getHours timestamp
        min = padNum <| DateTime.getMinutes timestamp
        s = padNum <| DateTime.getSeconds timestamp
    in
        y ++ "/" ++ mon ++ "/" ++ d ++ " " ++ h ++ ":" ++ min ++ ":" ++ s

viewDuration : Time.Posix -> String
viewDuration duration =
    let
        durationMs = Time.posixToMillis duration
        sec = durationMs // 1000
        minutes = sec // 60
        remSec = sec - minutes * 60
    in
        String.fromInt minutes ++ "min " ++ padNum remSec ++ "sec"

padNum : Int -> String
padNum n =
    if n < 10
        then "0" ++ String.fromInt n
        else String.fromInt n




-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions _ =
  Sub.none

