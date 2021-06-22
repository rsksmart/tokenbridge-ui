/**
 * Credit to: https://arjunphp.com/can-paginate-array-objects-javascript/
 */
export function Paginator(items, page = 1, per_page = 5) {
    let offset = (page - 1) * per_page;
    let data = items.slice(offset).slice(0, per_page);
    let total_pages = Math.ceil(items.length / per_page);

    return {
        page,
        per_page,
        pre_page: page - 1 ? page - 1 : null,
        next_page: (total_pages > page) ? page + 1 : null,
        total: items.length,
        total_pages,
        data
    };
}
