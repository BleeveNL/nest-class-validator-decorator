# nest-class-validator-decorator

A custom decorator that uses the [`class-transformer`](https://github.com/typestack/class-transformer) and [`class-validator`](https://github.com/typestack/class-validator) npm packages under the hood to deserialize method response data and validate it according to a supplied "class-validator" class.

## Getting started

Add the decorator as a dependency to your project
`npm install -S nest-class-validator-decorator` or `yarn add -S nest class-validator-decorator`.

You can now import the decorator into your code like so:

```
import {}

...

@ValidateResponse(YourSchema)
public yourMethod() {
    // Your logic...
}
```

Any JSON returned from "yourMethod" will now be validated according to "YourSchema".

## Options

As a secondary param you can add [an "options" object containing ValidatorOptions](https://github.com/typestack/class-validator/blob/develop/src/validation/ValidatorOptions.ts) from "class-validator".
