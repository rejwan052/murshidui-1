export class ParagraphWord {
    break = false;
    index =  0;
    content = '';
    relevant = false;
    irrelevant = true;
    space = false;
    punctuation = false;
    ltrBlock = false;
    words: ParagraphWord[] = [];
}
