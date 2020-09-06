port module Visualization exposing (..)

import Dict exposing (Dict)
import OutageDetection exposing (NodeOutage)
import Time
import VegaLite exposing (..)

port elmToJS : Spec -> Cmd msg

allSummaryVisualizations : List NodeOutage -> Dict String Int -> Spec
allSummaryVisualizations outages outagesPerNode =
    combineSpecs [
        ("outages-counts-summary", outagesCountsPerNodeVisualization outagesPerNode),
        ("outages-lengths-summary", outagesLenghtsPerNodeVisualization outages)
    ]


outagesCountsPerNodeVisualization : Dict String Int -> Spec
outagesCountsPerNodeVisualization outagesPerNode =
    let
        outagesPerNodeList : List DataRow
        outagesPerNodeList = outagesPerNode
            |> Dict.toList
            |> List.foldl (\(nodeId, numOutages) acc ->
                dataRow [ ("node id", str nodeId), ("outages count", num (toFloat numOutages)) ] acc
             ) []

        data =
            dataFromRows [] outagesPerNodeList
        enc =
            encoding
                << position X [ pName "node id", pOrdinal ]
                << position Y [ pName "outages count", pQuant ]
    in
    toVegaLite
        [ title "Number of outages per node" []
        , data
        , enc []
        , bar []
        ]

outagesLenghtsPerNodeVisualization : List NodeOutage -> Spec
outagesLenghtsPerNodeVisualization outages =
    let
        outagesPerNodeList : List DataRow
        outagesPerNodeList = outages
            |> List.foldl (\{affectedNodeId, duration} acc ->
                dataRow [ ("node id", str affectedNodeId), ("outage duration", num (toFloat (Time.posixToMillis duration // 1000))) ] acc
             ) []

        data =
            dataFromRows [] outagesPerNodeList
        enc =
            encoding
                << position X [ pName "node id", pOrdinal ]
                << position Y [ pName "outage duration", pAggregate opSum, pQuant ]
    in
    toVegaLite
        [ title "Outage duration per node (in seconds)" []
        , data
        , enc []
        , bar []
        ]