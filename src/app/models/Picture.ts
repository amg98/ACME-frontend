import { Deserializable } from "./Deserializable"

export class Picture implements Deserializable {
    Buffer!: string;
    contentType!: string;

    deserialize(input: any) {
        Object.assign(this, input)
        return this
    }

    toJSON() {
        return {
            Buffer: this.Buffer,
            contentType: this.contentType
        }
    }
}