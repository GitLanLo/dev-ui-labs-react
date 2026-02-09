import { FormEvent, useState, ChangeEvent, Fragment } from 'react';
import { NewReview } from '../../types/review';

const MIN_COMMENT_LENGTH = 50;
const MAX_COMMENT_LENGTH = 300;

type CommentFormProps = {
  onSubmit: (review: NewReview) => void;
};

function CommentForm({ onSubmit }: CommentFormProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');

  const isCommentLengthValid =
    comment.length >= MIN_COMMENT_LENGTH && comment.length <= MAX_COMMENT_LENGTH;
  const isFormValid = rating !== null && isCommentLengthValid;

  const handleRatingChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setRating(Number(evt.target.value));
  };

  const handleCommentChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(evt.target.value);
  };

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (rating === null || !isCommentLengthValid) {
      return;
    }

    onSubmit({
      rating,
      comment: comment.trim(),
    });

    setRating(null);
    setComment('');
  };

  return (
    <form className="reviews__form form" action="#" method="post" onSubmit={handleSubmit}>
      <label className="reviews__label form__label" htmlFor="review">
        Your review
      </label>

      <div className="reviews__rating-form form__rating">
        {[5,4,3,2,1].map((star) => (
          <Fragment key={star}>
            <input
              className="form__rating-input visually-hidden"
              name="rating"
              value={star}
              id={`${star}-stars`}
              type="radio"
              required
              checked={rating === star}
              onChange={handleRatingChange}
            />
            <label
              htmlFor={`${star}-stars`}
              className="reviews__rating-label form__rating-label"
              title="rating"
            >
              <svg className="form__star-image" width="37" height="33" >
                <use xlinkHref="/img/sprite.svg#icon-star"></use>
              </svg>
            </label>
          </Fragment>
        ))}
      </div>

      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay..."
        value={comment}
        minLength={MIN_COMMENT_LENGTH}
        maxLength={MAX_COMMENT_LENGTH}
        required
        onChange={handleCommentChange}
      />

      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please set rating and write at least{' '}
          <b className="reviews__text-amount">50 characters</b>.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={!isFormValid}
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export { CommentForm };
