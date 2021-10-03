Manjusaka 4
===========

Manjusaka 4 is my latest attempt to write a tool for revealing information
based on reader's knowledge.

Intended at first as my way of leaving a _post mortem_ testament, this project
is now being more generic: the user may construct any puzzles using this tool.

Some features:
* User may leave multiple messages in one file.
* Each message is decrypted based on correct answers to a few dependent
  questions.
* Messages can be revealed progressively. Previous messages decrypted enables
  further steps. Otherwise no more decrytion is possible.
* A question may have multiple answers. Above progress can be made with
  branches: e.g. for different target groups, they may only view a subset of
  all messages.
* Messages are protected with strong cryptographic algorithms. All questions
  must be solved simutaneously (rather than individually) to derive the
  decryption key.

## Usage, Demo and Example

To begin, try out this [demo](./demo.html). It's configured with data (in
format of [YAML](https://yaml.org/spec/)) from
[this example](https://github.com/neoatlantis/manjusaka4/blob/master/example.yaml).
The example config should be fairly self-explanatory.

If you want to build your own Manjusaka file, use above demo and choose the
first link. Paste your own YAML file in, and click "compile". Your HTML is
then generated. 


