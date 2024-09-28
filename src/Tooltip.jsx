import PropTypes from 'prop-types'; // ES6

const mockedStateInfo = {
    "Texas": {
        description: "Everything is bigger in Texas"
    }
}

const Tooltip = ({
    name
}) => {

    console.log('tooltip', name, mockedStateInfo[name])

    return (
        <div className="absolute top-1/2 right-1/2">
            <b>{name}</b>
            <div>{name && mockedStateInfo[name]?.description}</div>
        </div>
    )
}

export default Tooltip

Tooltip.propTypes = {
    name: PropTypes.string
}