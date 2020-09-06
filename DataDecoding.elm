module DataDecoding exposing (SensorMeasurement, parseSensorMeasurements)

import DateTime exposing (DateTime)
import Csv
import List.Extra
import Maybe.Extra
import Iso8601

type alias SensorMeasurement = {
  timestamp : DateTime,
  nodeId : String,
  parameter: String
  }


parseSensorMeasurements : String -> Maybe (List SensorMeasurement)
parseSensorMeasurements content =
  let
    csv = Csv.parse content
    maybeTimestampIdx {- Maybe Int -} = csv.headers |> List.Extra.elemIndex "timestamp"
    maybeNodeIdIdx = csv.headers |> List.Extra.elemIndex "node_id"
    maybeParameterIdx = csv.headers |> List.Extra.elemIndex "parameter"
    maybeIndicies {- Maybe (Int, Int, Int) -} = Maybe.map3
        (\timestampIdx nodeIdIdx parameterIdx -> (timestampIdx, nodeIdIdx, parameterIdx))
        maybeTimestampIdx
        maybeNodeIdIdx
        maybeParameterIdx
  in
    maybeIndicies |> Maybe.andThen (parseCsvRows csv.records)


parseCsvRows : List (List String) -> (Int, Int, Int) -> Maybe (List SensorMeasurement)
parseCsvRows records indicies =
    records |> Maybe.Extra.traverse (parseCsvRow indicies)

parseCsvRow : (Int, Int, Int) -> List String -> Maybe SensorMeasurement
parseCsvRow (timestampIdx, nodeIdIdx, parameterIdx) row =
    let
        maybeTimestampStr = List.Extra.getAt timestampIdx row
        maybeTimestamp = maybeTimestampStr |> Maybe.andThen parseTimestamp
        maybeNodeId = List.Extra.getAt nodeIdIdx row
        maybeParameter = List.Extra.getAt parameterIdx row
    in
        Maybe.map3 (\timestamp nodeId parameter ->
            { timestamp = timestamp,
              nodeId = nodeId,
              parameter = parameter }
        ) maybeTimestamp maybeNodeId maybeParameter


parseTimestamp : String -> Maybe DateTime
parseTimestamp timestampStr =
  let
    isoTimestampStr = timestampStr
        |> String.replace "/" "-"
        |> String.replace " " "T"
  in
    Iso8601.toTime isoTimestampStr
        |> Result.toMaybe
        |> Maybe.map DateTime.fromPosix
