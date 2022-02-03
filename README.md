# PR Commits Count javascript action

Action to checks the count of commits in pull request.

## Inputs

### `except-branches`

Excepted source branches (possible to pass multiple branches separated by ;)

### `commits-count`

Possible count of commits (default 1)


## Example usage

**In the checkout task fetch-depth should be set to 0**

```script shell
commits-count:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: commits-count
        uses: fcarrero/pr-commits-count@v1.0
        with:
          except-branches: 'main;master;release'
```