Project Manjusaka v4
====================

Manjusaka system is a generator and displayer for a series of special designed,
structured, encrypted data. A few preset messages can be left with this system
as a compiled html page, and any user knowing the answers to a series of
questions may check them out.

## Working Principles

The messages hidden behind these data can be revealed based on user's
knowledges, proven by answering questions. Each message has a dependency on
required questions answered, after which the decryption key is derived and
plaintext revealed. It's like a lock with multiple slots: only when all keys
are presented, the lock will open.

Questions have hints for human decryptors. These questions and hints are
protected by _authorization keys(AK)_, which must be found out first. In other
words, questions do not exist in plaintext. They are answerable only after
authorized. Imagine a table of question & answer variables:

| Question UUID | AK  | Question Hint (Encrypted with AK) |
| ------------- | --- | --------------------------------- |
| cacedb74-4efb-4e17-8c65-848454606dec | 949bed9b49a7012 | <My name is?>(encrypted) |
| 626a6ac6-5dbe-40fd-a805-417381b66a14 | 45135b1ff6e1121 | <Name of my dog?>(encrypted) |
| ... | ... | ... |

Above table is meaningless when user first runs the script:

| Question UUID | AK  | Question Hint (Encrypted with AK) |
| ------------- | --- | --------------------------------- |
| cacedb74-4efb-4e17-8c65-848454606dec |  | (ciphertext) |
| 626a6ac6-5dbe-40fd-a805-417381b66a14 |  | (ciphertext) |
| ... | ... | ... | ... |

When a message is decrypted, it yields 2 types of new information:
authorization keys, and plaintext payloads. Either or both type may be contained
in a message. New authorization keys lead to more questions opened for answer,
and plaintext payloads will be presented to user. So if we have a "boot" message
with zero dependency (meaning it's ready for decryption without any questions),
which contains:

1. assignment: question <cacedb74-4efb-4e17-8c65-848454606dec> have AK = "949bed9b49a7012"
2. a welcome message

Then the user will see, upon loading the page and the boot message decrypted first the welcome message. Whereas above table will also become:

| Question UUID | AK  | Question Hint (Encrypted with AK) | Question Hint (Plaintext) |
| ------------- | --- | --------------------------------- | ------------------------- |
| cacedb74-4efb-4e17-8c65-848454606dec | 949bed9b49a7012  | (ciphertext) | |
| 626a6ac6-5dbe-40fd-a805-417381b66a14 |  | (ciphertext) | |
| ... | ... | ... | ... |

In the next iteration, the first question's hint is able to be decrypted. The
user will be prompted with this hint.

| Question UUID | AK  | Question Hint (Encrypted with AK) | Question Hint (Plaintext) |
| ------------- | --- | --------------------------------- | ------------------------- |
| cacedb74-4efb-4e17-8c65-848454606dec | 949bed9b49a7012  | (ciphertext) | My name is? |
| 626a6ac6-5dbe-40fd-a805-417381b66a14 |  | (ciphertext) |  |
| ... | ... | ... | ... |

There is no validation data stored for user provided answers. Value of a
question is derived as (AK + user-answer) by a hash function. This value is
provided to any message declaring with this dependency and used for trial
decryption. Such design avoids brute force on single questions one by one,
since each question contains only a small amount of entropy. Authorization keys
serve as "nonces" and will ensure same answer will not result in same question
values when a page is generated repeatedly.
