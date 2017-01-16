import { Blaze } from 'meteor/blaze';
import { moment } from 'meteor/momentjs:moment';

/**
 * A global Blaze UI helper function to format DICOM Dates using the Moment library
 */

const formatDA = (context, format, options) => {
    if (!context) {
        return undefined;
    }
    var dateAsMoment = moment(context, "YYYYMMDD");
    var strFormat = "MMM D, YYYY";
    if (options) {
        strFormat = format;
    }
    return dateAsMoment.format(strFormat);
};

Blaze.registerHelper('formatDA', formatDA);

export { formatDA };
