export default function ({ children }) {
  const [
    rbffaafae74af1432550cf519903bacb1doSelect,
    setRbffaafae74af1432550cf519903bacb1doSelect,
  ] = useState(null);
  const [
    rbffaafae74af1432550cf519903bacb1doFloatShow,
    setRbffaafae74af1432550cf519903bacb1doFloatShow,
  ] = useState(null);
  const [
    rbffaafae74af1432550cf519903bacb1doFloatButtonClick,
    setRbffaafae74af1432550cf519903bacb1doFloatButtonClick,
  ] = useState(0);
  const [
    r9cbae8832414995be6a5846399135efbdoShow,
    setR9cbae8832414995be6a5846399135efbdoShow,
  ] = useState("Complete");
  const [
    r9cbae8832414995be6a5846399135efbdoMove,
    setR9cbae8832414995be6a5846399135efbdoMove,
  ] = useState([0, 0]);
  return React.createElement(children.type, {
    ...children.props,
    ...{
      "@reduce/1": {
        in_org_id: "@reduce/pdf@0.0.0",
        hooks: {
          doSelect: rbffaafae74af1432550cf519903bacb1doSelect,
          setDoSelect: setRbffaafae74af1432550cf519903bacb1doSelect,
          doFloatShow: rbffaafae74af1432550cf519903bacb1doFloatShow,
          setDoFloatShow: setRbffaafae74af1432550cf519903bacb1doFloatShow,
          doFloatButtonClick:
            rbffaafae74af1432550cf519903bacb1doFloatButtonClick,
          setDoFloatButtonClick:
            setRbffaafae74af1432550cf519903bacb1doFloatButtonClick,
        },
        config: {},
      },
      "@reduce/2": {
        in_org_id: "@reduce/card@0.0.0",
        hooks: {
          doShow: r9cbae8832414995be6a5846399135efbdoShow,
          setDoShow: setR9cbae8832414995be6a5846399135efbdoShow,
          doMove: r9cbae8832414995be6a5846399135efbdoMove,
          setDoMove: setR9cbae8832414995be6a5846399135efbdoMove,
        },
        config: {},
      },
    },
  });
}
