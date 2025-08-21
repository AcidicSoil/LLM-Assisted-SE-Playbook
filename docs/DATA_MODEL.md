# Data Model

## Node
```
{id, type, title, summary?, detailsMD?, tags[], roles[], stages[], inputs[], outputs[], impact 1-5, effort 1-5, difficulty, maturity, references[], sourcePath?}
```

## Relation
```
{id, fromId, toId, kind, weight?, evidence?}
```

## Dataset
```
{ nodes: Node[], relations: Relation[], glossary?, sources? }
```
