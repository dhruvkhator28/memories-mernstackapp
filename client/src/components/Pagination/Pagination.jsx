import React, { useEffect } from 'react';
import { Pagination, PaginationItem } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import useStyles from './styles.js';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../../actions/posts.js';


const Paginate = ({ page, currentId}) =>{
    const classes = useStyles();
    const dispatch = useDispatch();
    const { numberOfPages } = useSelector((state) => state.posts);
    
    useEffect(() => {
        if(page) dispatch(getPosts(page));
    }, [dispatch, page]);

    return(
        <Pagination
            classes={{ ul: classes.ul }}
            count={numberOfPages}
            page={Number(page) || 1}
            variant="outlined"
            color="primary"
            renderItem={(item) => (
                <PaginationItem { ...item } component={Link} to={`/posts?page=${item.page}`} />
            )}
        />
    )
}

export default Paginate;